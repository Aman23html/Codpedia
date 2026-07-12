// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// import { connectDB } from "@/lib/mongodb";
// import { User } from "@/models/User";
// import "@/models/Department";

// const getJwtSecret = () => {
//   const secret = process.env.JWT_SECRET;

//   if (!secret) {
//     throw new Error("JWT_SECRET is missing in .env");
//   }

//   return secret;
// };

// export async function getCurrentUser() {
//   try {
//     await connectDB();

//     const cookieStore = await cookies();
//     const token = cookieStore.get("ems_token")?.value;

//     if (!token) {
//       return null;
//     }

//     const decoded = jwt.verify(token, getJwtSecret()) as unknown as {
//       id?: string;
//       role?: string;
//     };

//     if (!decoded.id || !decoded.role) {
//       return null;
//     }

//     console.log("DECODED TOKEN:", decoded);
//     console.log("CURRENT USER ID FROM TOKEN:", decoded.id);

//     const user: any = await User.findById(decoded.id)
//       .populate({
//         path: "department",
//         select: "name type departmentCode shortCode",
//       })
//       .lean();

//     if (!user) {
//       return null;
//     }

//     return {
//       id: user._id.toString(),
//       fullName: user.fullName,
//       username: user.username,
//       email: user.email,
//       phone: user.phone,
//       role: user.role,
//       status: user.status,
//       employeeCode: user.employeeCode || null,
//       profileImageUrl: user.profileImageUrl || null,
//       coverImageUrl: user.coverImageUrl || null,

//       departmentId: user.department?._id?.toString() || null,

//       department: user.department
//         ? {
//             id: user.department._id.toString(),
//             name: user.department.name,
//             type: user.department.type,
//             departmentCode: user.department.departmentCode,
//             shortCode: user.department.shortCode,
//           }
//         : null,

//       createdAt: user.createdAt?.toISOString?.() || null,
//       updatedAt: user.updatedAt?.toISOString?.() || null,
//     };
//   } catch (error) {
//     console.error("getCurrentUser error:", error);
//     return null;
//   }
// }


import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import "@/models/Department";

type JwtPayload = {
  id?: string;
  role?: string;
};

type PopulatedDepartment = {
  _id: {
    toString(): string;
  };
  name?: string;
  type?: string;
  departmentCode?: string;
  shortCode?: string;
};

type CurrentUserDocument = {
  _id: {
    toString(): string;
  };
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  employeeCode?: string | null;
  profileImageUrl?: string | null;
  coverImageUrl?: string | null;
  department?: PopulatedDepartment | null;
  createdAt?: Date;
  updatedAt?: Date;
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  return secret;
};

export async function getCurrentUser() {
  /*
   * Keep cookies outside try/catch.
   * Next.js must be able to handle its dynamic-rendering signal.
   */
  const cookieStore = await cookies();
  const token = cookieStore.get("ems_token")?.value;

  if (!token) {
    return null;
  }

  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch (error) {
    /*
     * Invalid or expired token is an expected authentication failure.
     */
    if (error instanceof jwt.TokenExpiredError) {
      console.warn("Authentication token expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.warn("Invalid authentication token");
    } else {
      console.error("JWT verification error:", error);
    }

    return null;
  }

  if (!decoded.id || !decoded.role) {
    return null;
  }

  try {
    await connectDB();

    const user = (await User.findById(decoded.id)
      .populate({
        path: "department",
        select: "name type departmentCode shortCode",
      })
      .lean()) as CurrentUserDocument | null;

    if (!user) {
      return null;
    }

    /*
     * Optional security check:
     * Prevent use of a token whose role differs from the database role.
     */
    if (user.role !== decoded.role) {
      console.warn("Token role does not match the current database role");
      return null;
    }

    return {
      id: user._id.toString(),
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      employeeCode: user.employeeCode ?? null,
      profileImageUrl: user.profileImageUrl ?? null,
      coverImageUrl: user.coverImageUrl ?? null,

      departmentId: user.department?._id?.toString() ?? null,

      department: user.department
        ? {
            id: user.department._id.toString(),
            name: user.department.name ?? "",
            type: user.department.type ?? "",
            departmentCode: user.department.departmentCode ?? "",
            shortCode: user.department.shortCode ?? "",
          }
        : null,

      createdAt: user.createdAt?.toISOString() ?? null,
      updatedAt: user.updatedAt?.toISOString() ?? null,
    };
  } catch (error) {
    console.error("Failed to load current user:", error);
    return null;
  }
}