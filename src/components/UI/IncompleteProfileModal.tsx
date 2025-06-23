import React from "react";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle, HiOutlineShieldExclamation } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const IncompleteProfileModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    onClose();
    navigate("/member/profile");
  };

  return (
    <Modal show={isOpen} size="lg" position="center" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div>
          <div className="m-auto w-fit bg-yellow-500/20 p-4 rounded-full mb-4 ">
            <HiOutlineShieldExclamation className="mx-auto h-14 w-14 text-yellow-500 " />
          </div>

          <h3 className="mb-2 text-center text-lg font-semibold text-gray-900 dark:text-white">
            Profile Completion Required
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Completing your profile is <strong>essential</strong> to unlock the
            full potential of your membership. Without it, you won’t be able to
            access your dashboard or enjoy the full range of features and
            benefits available to you as a member.
          </p>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Please take a moment to complete your profile to proceed.
          </p>
          <div className="mt-5 flex justify-center gap-4">
            <Button color="blue" onClick={handleRedirect}>
              Go to Profile
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default IncompleteProfileModal;
