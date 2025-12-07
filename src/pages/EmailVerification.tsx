import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

const EmailVerification: React.FC = () => {
  const { toast } = useToast();

  const resendEmail = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Email Sent', 'Verification email has been resent.');
    } catch (error) {
      toast.error('Error', 'Failed to resend verification email.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="text-gray-700 mb-6">A verification email has been sent to your inbox. Please check your email and click the verification link.</p>
        <Button onClick={resendEmail} className="w-full">
          Resend Verification Email
        </Button>
      </Card>
    </div>
  );
};

export default EmailVerification;