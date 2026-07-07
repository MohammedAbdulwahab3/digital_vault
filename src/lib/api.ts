import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError } from "./auth";

/** Wraps a route handler with uniform error responses. */
export function handle<T extends unknown[]>(
  fn: (...args: T) => Promise<NextResponse | Response>
) {
  return async (...args: T) => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err instanceof AuthError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      if (err instanceof ZodError) {
        const first = err.issues[0];
        return NextResponse.json(
          { error: first ? `${first.path.join(".")}: ${first.message}` : "Invalid input" },
          { status: 400 }
        );
      }
      console.error("[api]", err);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  };
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}
