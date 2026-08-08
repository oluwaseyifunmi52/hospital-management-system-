import { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { OtpInput } from '../../components/ui/OtpInput';
import { authService } from '../../services/auth.service';
import { Loader2, ArrowLeft, RotateCcw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function VerifyEmail() {
  const location = useLocation();
  const email = (location.state as any)?.email || '';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleVerify = useCallback(async (otpValue: string) => {
    if (otpValue.length !== 6 || !email || isLoading) return;

    setIsLoading(true);
    try {
      await authService.verifyEmail(email, otpValue);
      setIsVerified(true);
      toast.success('Email verified successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP. Please try again.');
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  }, [email, isLoading]);

  const handleOtpChange = useCallback((value: string) => {
    setOtp(value);
    if (value.length === 6) {
      handleVerify(value);
    }
  }, [handleVerify]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await authService.resendOTP(email);
      toast.success('A new OTP has been sent to your email.');
      setResendTimer(60);
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary-900">SmartCare</h1>
          </div>
          <div className="card p-8 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              Email Verified!
            </h2>
            <p className="text-secondary-500 mb-6">
              Your email has been verified successfully. You can now sign in to your account.
            </p>
            <Link to="/login" className="btn-primary inline-flex">
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">SmartCare</h1>
          <p className="mt-2 text-secondary-500">Verify your email address</p>
        </div>

        <div className="card p-6">
          <div className="text-center mb-6">
            <p className="text-secondary-600">
              We&apos;ve sent a 6-digit verification code to
            </p>
            <p className="font-medium text-secondary-900 mt-1">{email || 'your email'}</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(otp);
            }}
            className="space-y-6"
          >
            <div>
              <OtpInput
                length={6}
                value={otp}
                onChange={handleOtpChange}
                disabled={isLoading}
                autoFocus
              />

            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={otp.length !== 6 || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-500">
              Didn&apos;t receive the code?{' '}
              {resendTimer > 0 ? (
                <span className="text-secondary-400">
                  Resend in {resendTimer}s
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
                >
                  {isResending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RotateCcw className="h-3 w-3" />
                  )}
                  Resend code
                </button>
              )}
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-sm text-secondary-500 hover:text-secondary-700 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" /> Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
