import axios from "axios";
import jwtModule from "jsonwebtoken";
import NextAuth, { NextAuthOptions } from "next-auth";
import { apiBaseUrl } from "src/constants/environmentConstant";
import CredentialProvider from "next-auth/providers/credentials";

if (!apiBaseUrl) {
  throw new Error("No Api baseUrl");
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialProvider({
      name: "credentials",
      id: "credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text", placeholder: "role" },
        rememberMe: { label: "Remember me", type: "checkbox" },
      },

      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials");
        }

        try {
          const response = await axios.post(`${apiBaseUrl}/auth/login`, credentials, {
            headers: {
              accept: "*/*",
              "Content-Type": "application/json",
            },
          });

          return { ...response.data, rememberMe: credentials.rememberMe };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw {
              ...error,
              message: error.response?.data?.message,
            };
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/",
  },
  callbacks: {
    // FIXME: This is a workaround for the issue
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    /* @ts-ignore */
    async jwt({ token, user }) {
      if (token) {
        const backendToken = token.accessToken;
        const decodedToken = backendToken ? jwtModule.decode(backendToken) : null;
        if (decodedToken && typeof decodedToken !== "string" && decodedToken.exp) {
          if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
            if (token.rememberMe) {
              const response = await axios.post(
                `${apiBaseUrl}/auth/refresh-token `,
                {
                  refresh_token: token.refreshToken,
                },
                {
                  headers: {
                    accept: "*/*",
                    "Content-Type": "application/json",
                  },
                }
              );

              return {
                ...token,
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
              };
            }

            return null;
          }
        }
      }

      if (user) {
        token = {
          accessToken: user.access_token,
          refreshToken: user.refresh_token,
          user: user.user,
          rememberMe: user.rememberMe,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token.accessToken && token.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
