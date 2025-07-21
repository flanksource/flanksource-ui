import React from "react";
import { Key } from "lucide-react";
import { Authentication } from "../types";

interface AuthCardProps {
  auth: Authentication;
}

const AuthCard: React.FC<AuthCardProps> = ({ auth }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <Key className="mr-2 text-gray-400" size={16} />
              <h4 className="font-medium">{auth.name}</h4>
            </div>
            <span className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-500">
              {auth.type.toUpperCase()}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500">MFA Type</p>
          <p className="text-sm">{auth.mfa.type}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">MFA Enforcement</p>
          <p className="text-sm">{auth.mfa.enforced}</p>
        </div>

        {auth.passwordPolicy && (
          <>
            <div>
              <p className="text-xs text-gray-500">Password Expiry</p>
              <p className="text-sm">{auth.passwordPolicy.expiry}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Password Strength</p>
              <p className="text-sm">{auth.passwordPolicy.strength}</p>
            </div>
          </>
        )}

        {auth.provider && (
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Provider</p>
            <p className="text-sm">{auth.provider}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCard;
