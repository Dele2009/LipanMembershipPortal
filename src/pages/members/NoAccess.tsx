// src/app/NotAccessPage.tsx
import { Link } from "react-router-dom";
import { FiShieldOff, FiArrowRight, FiArrowLeft, FiShield } from "react-icons/fi";
import { Button } from "flowbite-react";
import { usePayment } from "../../hooks/payment";

function NotAccessPage() {
     const {openMembershipModal} = usePayment()
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3rem)] p-6">
      {/* Icon with background */}
      <div className="flex items-center justify-center mb-6 p-6 rounded-full bg-red-100 dark:bg-red-900">
        <FiShieldOff size={100} color="#ff0000" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center">
        Access Restricted
      </h1>

      {/* Description */}
      <p className="text-md mb-6 text-gray-500 dark:text-gray-400 text-center max-w-md">
        Your current membership plan does not allow you to view this page.
        Please consider
        <span className="font-semibold ml-1 mr-1">
          upgrading your membership
        </span>
        to unlock additional features and benefits.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Upgrade button */}
        <Button
          onClick={openMembershipModal}
          color="blue"
          size="md"
          className="flex items-center font-semibold shadow-md transition-all"
        >
          <FiShield size={18} className="mr-2 h-5" />
          Upgrade Membership
        </Button>

        {/* Back button */}
        <Button
          as={Link}
          to="/member/dashboard"
          color="dark"
          outline
          size="md"
          className="flex items-center font-semibold shadow-md transition-all"
        >
          Back to Dashboard
          {/* <FiArrowLeft size={18} className="ml-2 h-5" /> */}
        </Button>
      </div>
    </div>
  );
}

export default NotAccessPage;
