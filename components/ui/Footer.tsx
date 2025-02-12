import React from "react";
import { CardDescription, CardFooter } from "./card";
import Link from "next/link";

function Footer() {
  return (
    <CardFooter className="mt-6 justify-center">
      <CardDescription className="text-center p-2">
        Created by{" "}
        <Link
          className="text-purple-600 font-semibold hover:underline"
          href="https://shadialmilhem.com"
        >
          Shadi Al Milhem
        </Link>
      </CardDescription>
    </CardFooter>
  );
}

export default Footer;
