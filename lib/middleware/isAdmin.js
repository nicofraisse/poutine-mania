import { getServerSession } from "next-auth/next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export function isAdmin(handler) {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.isAdmin) {
      return res.status(403).json({ error: "Not allowed" });
    }
    return handler(req, res);
  };
}
