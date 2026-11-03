/**
 * RDX CRM - Secure Server-Side Authentication & RBAC Engine
 * Strict server-side verification, password hashing, session tokens, and tenant isolation.
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db, UserRecord, SessionRecord, UserRole } from './db';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: UserRecord;
      sessionToken?: string;
    }
  }
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export const authService = {
  // Register a new organization and business owner
  registerBusinessOwner(data: {
    businessName: string;
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    planId?: 'starter' | 'growth' | 'enterprise';
  }): { user: Omit<UserRecord, 'passwordHash' | 'salt'>; token: string; businessId: string } {
    const existing = db.raw.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase().trim());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const businessId = `biz_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const userId = `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(data.password, salt);

    // Create Business Record
    db.raw.businesses.push({
      id: businessId,
      name: data.businessName.trim(),
      ownerEmail: data.email.toLowerCase().trim(),
      planId: data.planId || 'growth',
      status: 'active',
      connectedSince: new Date().toISOString(),
      whatsappPhone: data.phone,
      aiSettings: {
        enabled: true,
        businessPrompt: `Welcome to ${data.businessName}. We are here to assist with your inquiries.`,
        tone: 'professional',
        language: 'English',
        knowledgeBase: '',
        autoReplyOutsideHours: true,
        handoverKeywords: ['agent', 'human', 'help', 'representative'],
        monthlyUsageLimit: 5000,
        usageThisMonth: 0,
      },
      messagesSentThisMonth: 0,
      messageLimit: data.planId === 'enterprise' ? 60000 : data.planId === 'starter' ? 2500 : 12000,
      agentSeatsLimit: data.planId === 'enterprise' ? 35 : data.planId === 'starter' ? 3 : 10,
    });

    // Create User Record with 'Business Owner' role
    const newUser: UserRecord = {
      id: userId,
      name: data.fullName.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash,
      salt,
      role: 'Business Owner',
      businessId,
      businessName: data.businessName.trim(),
      status: 'active',
      phone: data.phone,
      createdAt: new Date().toISOString(),
    };

    db.raw.users.push(newUser);

    // Create Session Token
    const sessionToken = generateSecureToken(32);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    db.raw.sessions.push({
      token: sessionToken,
      userId,
      businessId,
      role: newUser.role,
      expiresAt,
      createdAt: new Date().toISOString(),
    });

    db.raw.auditLogs.push({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: `${newUser.name} (${newUser.email})`,
      role: newUser.role,
      businessId,
      action: 'ORGANIZATION_REGISTER',
      target: `New Business Tenant created: ${data.businessName}`,
      ipAddress: '127.0.0.1',
      status: 'Success',
    });

    db.save();

    const { passwordHash: _, salt: __, ...sanitizedUser } = newUser;
    return { user: sanitizedUser, token: sessionToken, businessId };
  },

  // Login
  login(email: string, passwordAttempt: string): { user: Omit<UserRecord, 'passwordHash' | 'salt'>; token: string } {
    const user = db.raw.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      throw new Error('Invalid email or password credentials.');
    }

    if (user.status === 'suspended') {
      throw new Error('This account has been suspended by the platform administrator.');
    }

    const calculatedHash = hashPassword(passwordAttempt, user.salt);
    if (calculatedHash !== user.passwordHash) {
      db.raw.auditLogs.push({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: email,
        role: 'unauthenticated',
        action: 'FAILED_LOGIN_ATTEMPT',
        target: 'Credential Verification Failure',
        ipAddress: '127.0.0.1',
        status: 'Warning',
      });
      db.save();
      throw new Error('Invalid email or password credentials.');
    }

    user.lastLoginAt = new Date().toISOString();

    const sessionToken = generateSecureToken(32);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    db.raw.sessions.push({
      token: sessionToken,
      userId: user.id,
      businessId: user.businessId,
      role: user.role,
      expiresAt,
      createdAt: new Date().toISOString(),
    });

    db.raw.auditLogs.push({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: `${user.name} (${user.email})`,
      role: user.role,
      businessId: user.businessId,
      action: 'USER_LOGIN',
      target: 'Authenticated Session Created',
      ipAddress: '127.0.0.1',
      status: 'Success',
    });

    db.save();

    const { passwordHash: _, salt: __, ...sanitizedUser } = user;
    return { user: sanitizedUser, token: sessionToken };
  },

  // Logout & Revoke Session
  logout(token: string): void {
    db.raw.sessions = db.raw.sessions.filter((s) => s.token !== token);
    db.save();
  },

  // Password Reset Initiation
  createPasswordReset(email: string): string {
    const user = db.raw.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      // Don't leak user presence
      return 'If an account with that email exists, password reset instructions have been generated.';
    }

    const resetToken = generateSecureToken(24);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    db.raw.passwordResets.push({
      token: resetToken,
      userId: user.id,
      expiresAt,
    });

    db.raw.auditLogs.push({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: user.email,
      role: user.role,
      action: 'REQUEST_PASSWORD_RESET',
      target: '15-min recovery token generated',
      ipAddress: '127.0.0.1',
      status: 'Success',
    });

    db.save();
    return resetToken;
  },

  // Complete Password Reset
  completePasswordReset(token: string, newPassword: string): void {
    const resetRecord = db.raw.passwordResets.find((r) => r.token === token);
    if (!resetRecord || new Date(resetRecord.expiresAt) < new Date()) {
      throw new Error('Invalid or expired password reset token.');
    }

    const user = db.raw.users.find((u) => u.id === resetRecord.userId);
    if (!user) {
      throw new Error('Associated user record not found.');
    }

    user.salt = crypto.randomBytes(16).toString('hex');
    user.passwordHash = hashPassword(newPassword, user.salt);

    // Invalidate reset token and all active sessions for security
    db.raw.passwordResets = db.raw.passwordResets.filter((r) => r.token !== token);
    db.raw.sessions = db.raw.sessions.filter((s) => s.userId !== user.id);

    db.raw.auditLogs.push({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: user.email,
      role: user.role,
      action: 'RESET_PASSWORD_COMPLETED',
      target: 'User password reset and sessions invalidated',
      ipAddress: '127.0.0.1',
      status: 'Success',
    });

    db.save();
  },
};

// Express Middleware: Extract and verify session
export const authenticateRequest = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : authHeader.trim();
  if (!token) {
    return next();
  }

  const session = db.raw.sessions.find((s) => s.token === token);
  if (!session || new Date(session.expiresAt) < new Date()) {
    return next();
  }

  const user = db.raw.users.find((u) => u.id === session.userId && u.status === 'active');
  if (user) {
    req.user = user;
    req.sessionToken = token;
  }
  next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  next();
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}].`,
      });
    }
    next();
  };
};

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'Platform Super Admin') {
    return res.status(403).json({ error: 'Super Admin privileges required.' });
  }
  next();
};

// Strict Multi-Tenant Enforcement Middleware
export const enforceTenantIsolation = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  // Super Admin has global tenant oversight
  if (req.user.role === 'Platform Super Admin') {
    return next();
  }

  // Ensure requests with a businessId param or query match the user's business
  const targetBusinessId = req.params.businessId || req.query.businessId || req.body.businessId;
  if (targetBusinessId && targetBusinessId !== req.user.businessId) {
    return res.status(403).json({
      error: 'Security Violation: Cross-tenant data access is strictly forbidden.',
    });
  }

  next();
};
