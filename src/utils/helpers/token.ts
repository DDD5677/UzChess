import jwt from "jsonwebtoken";

export const generateTokens = (id: number, isAdmin: boolean) => {
   const accessToken = jwt.sign(
      { id, isAdmin },
      String(process.env.ACCESS_TOKEN_SECRET),
      {
         expiresIn: "1h",
      }
   );
   const refreshToken = jwt.sign(
      { id, isAdmin },
      String(process.env.REFRESH_TOKEN_SECRET),
      {
         expiresIn: "1h",
      }
   );

   return { accessToken, refreshToken };
};
