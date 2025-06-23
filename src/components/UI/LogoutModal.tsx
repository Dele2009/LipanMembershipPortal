import { Modal, Button } from "flowbite-react";
import {
  FaExclamationTriangle,
  FaSignOutAlt,
  FaTimesCircle,
} from "react-icons/fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}
const LogoutModal = ({ isOpen, onClose, onLogout }: Props) => (
  <Modal show={isOpen} onClose={onClose} position="center" size="md">
    <Modal.Body className="text-center">
      <div className="flex justify-center items-center size-24 mx-auto mb-4 rounded-full bg-[#ff0000]/20">
        <FaExclamationTriangle className="text-[#ff0000] text-5xl" />
      </div>
      <p className="text-gray-400 text-md">Are you sure you want to log out?</p>
      <div className="flex justify-center gap-4 mt-6">
        <Button
          size="md"
          color="gray"
          className="!text-gray-800 dark:!text-white"
          onClick={onClose}
        >
          <FaTimesCircle className="h-6 mr-3 text-lg" />
          Cancel
        </Button>
        <Button
          size="md"
          className="!bg-[#ff0000] hover:!bg-[#ff0000]/80"
          onClick={onLogout}
        >
          <FaSignOutAlt className="h-6 text-white mr-3 text-lg" />
          Logout
        </Button>
      </div>
    </Modal.Body>
  </Modal>
);

export default LogoutModal;
