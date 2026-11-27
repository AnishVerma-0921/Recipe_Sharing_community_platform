import { useEffect, useState } from "react";
import { loginUser, registerUser } from "./auth/credentials.js";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
    const [mode, setMode] = useState("login"); // "login" | "signup"
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        function handleKeyDown(e) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    function switchMode(nextMode) {
        setMode(nextMode);
        setError("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setEmail("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        const cleanEmail = email.trim().toLowerCase();
        const cleanName = name.trim();

        if (!cleanEmail || !password) {
            setError("Enter your email and password to continue.");
            return;
        }

        if (mode === "signup" && !cleanName) {
            setError("Enter a display name for your chef profile.");
            return;
        }
        if (mode === "signup" && password.length < 8) {
            setError("Choose a password with at least 8 characters.");
            return;
        }
        if (mode === "signup" && password !== confirmPassword) {
            setError("Your passwords do not match.");
            return;
        }

        setSubmitting(true);
        try {
            const user = mode === "signup"
                ? await registerUser({ name: cleanName, email: cleanEmail, password })
                : await loginUser({ email: cleanEmail, password });
            onAuthSuccess(user);
        } catch (authError) {
            setError(authError.message || "Unable to authenticate. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div
            className="auth-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            onClick={onClose}
        >
            <div className="form-panel auth-modal-card" onClick={e => e.stopPropagation()}>
                <div className="auth-modal-top">
                    <span className="feed-eyebrow">FORKFUL COMMUNITY</span>
                    <button
                        type="button"
                        className="remove-button auth-modal-close"
                        onClick={onClose}
                        aria-label="Close popup"
                    >
                        ×
                    </button>
                </div>

                <h2 id="auth-modal-title">
                    {mode === "login" ? "Welcome back to the kitchen." : "Join the Forkful table."}
                </h2>
                <p className="recipe-author auth-modal-subtitle">
                    {mode === "login"
                        ? "Sign in to access your profile, saved cookbook, and published dishes."
                        : "Create an account to publish recipes and build your chef profile."}
                </p>

                <div className="filter-options auth-mode-switch" role="tablist">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={mode === "login"}
                        className={`filter-chip ${mode === "login" ? "selected" : ""}`}
                        onClick={() => switchMode("login")}
                    >
                        Log in
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={mode === "signup"}
                        className={`filter-chip ${mode === "signup" ? "selected" : ""}`}
                        onClick={() => switchMode("signup")}
                    >
                        Sign up
                    </button>
                </div>

                <form className="publish-form" onSubmit={handleSubmit}>
                    {mode === "signup" && (
                        <label className="field-label">
                            Chef name
                            <input
                                type="text"
                                placeholder="e.g. Meera P."
                                value={name}
                                onChange={e => setName(e.target.value)}
                                maxLength={50}
                                autoFocus
                            />
                        </label>
                    )}

                    <label className="field-label">
                        Email address
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoFocus={mode === "login"}
                        />
                    </label>

                    <label className="field-label">
                        Password
                        <input
                            type="password"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </label>

                    {mode === "signup" && (
                        <label className="field-label">
                            Confirm password
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </label>
                    )}

                    {error && (
                        <p className="publish-error" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="form-actions">
                        <button className="button button-green" type="submit" disabled={submitting}>
                            {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
                        </button>
                        <button className="button button-outline" type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>

                <p className="recipe-author auth-switch-hint">
                    <span>{mode === "login" ? "New to Forkful?" : "Already have an account?"}</span>
                    <button
                        type="button"
                        className="recipe-title auth-inline-link"
                        onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                    >
                        {mode === "login" ? "Create an account" : "Log in instead"}
                    </button>
                </p>
            </div>
        </div>
    );
}
