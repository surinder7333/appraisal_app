import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ReduxProvider } from "@/redux/provider";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ABC Company Appraisal System",
  description: "Employee appraisal management system",
  generator: "v0.dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <AuthProvider>{children}</AuthProvider>
          <ToastContainer />
        </ReduxProvider>
      </body>
    </html>
  );
}

import "./globals.css";
