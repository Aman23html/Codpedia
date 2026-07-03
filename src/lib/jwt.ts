import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export type JwtPayload = {
  userId: string;
  role: string;
  departmentId: string;
};

export function createToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    console.log(
      "JWT VERIFIED:",
      decoded
    );

    return decoded;
  } catch (error) {
    console.error(
      "JWT VERIFY FAILED:",
      error
    );

    return null;
  }
}