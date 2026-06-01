"use client";

import Link from "next/link";
import { Button } from "@lumen-ui/react";

interface ViewAllLinkProps {
  href: string;
  label: string;
}

export function ViewAllLink({ href, label }: ViewAllLinkProps) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Button variant="outline">{label}</Button>
    </Link>
  );
}
