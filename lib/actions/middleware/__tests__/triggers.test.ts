/**
 * Tests for middleware triggers
 */

import { applyTriggers, performNavigation, handleTriggers, NAVIGATION_TRIGGERS } from "../triggers";
import { AppError, ErrorCode, HttpStatus } from "@/lib/errors/app-error";

// Mock next/navigation helpers so they don't actually redirect
jest.mock("next/navigation", () => ({ redirect: jest.fn(), notFound: jest.fn() }));

describe("middleware triggers", () => {
    beforeEach(() => jest.clearAllMocks());

    it("matches not-found trigger and returns notFound effect when handled", () => {
        const err = new AppError("Not found", { code: ErrorCode.NOT_FOUND, status: HttpStatus.NOT_FOUND });
        const effect = applyTriggers(err as any, { handleNotFound: true });
        expect(effect).toEqual({ notFound: true });
    });

    it("matches auth-failure trigger and returns redirect effect", () => {
        const err = new AppError("Invalid authentication credentials", { code: ErrorCode.UNAUTHORIZED, status: HttpStatus.UNAUTHORIZED });
        const effect = applyTriggers(err as any, { authRedirect: "/custom" });
        expect(effect).toEqual({ redirect: "/custom" });
    });

    it("performNavigation calls redirect and notFound as appropriate", () => {
        const nav = require("next/navigation");
        performNavigation({ redirect: "/x" });
        expect(nav.redirect).toHaveBeenCalledWith("/x");

        performNavigation({ notFound: true });
        expect(nav.notFound).toHaveBeenCalled();
    });

    it("handleTriggers applies and performs navigation", () => {
        const nav = require("next/navigation");
        const err = new AppError("Invalid authentication credentials", { code: ErrorCode.UNAUTHORIZED });
        const effect = handleTriggers(err as any, { authRedirect: "/go" });
        expect(effect).toEqual({ redirect: "/go" });
        expect(nav.redirect).toHaveBeenCalledWith("/go");
    });
});
