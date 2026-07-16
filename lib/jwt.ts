import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-at-least-32-characters-long";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
  id: string;
  username: string;
  role: "admin";
}

export async function signAccessToken(payload: JWTPayload): Promise<string> {
  return await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m") // 15 minutes session timeout
    .sign(secretKey);
}

export async function signRefreshToken(payload: JWTPayload): Promise<string> {
  return await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7 days refresh validity
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<jose.JWTVerifyResult & { payload: JWTPayload } | null> {
  try {
    const result = await jose.jwtVerify(token, secretKey);
    return result as any;
  } catch (error) {
    return null;
  }
}
