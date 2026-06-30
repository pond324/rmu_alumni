import { FaCheck, FaTimes } from "react-icons/fa";

const PasswordRules = ({ password }) => {
  return (
    <div className="flex flex-col gap-1.5 mt-3.5 p-5 border border-gray-300 rounded-md bg-blue-100 w-full">
      <span className="flex items-center gap-2">
        {password?.length > 8 ? (
          <FaCheck size={13} color="green" />
        ) : (
          <FaTimes size={13} color="red" />
        )}
        <p
          className={`text-sm ${
            password?.length > 8 ? "text-green-600" : "text-red-600"
          }`}
        >
          รหัสผ่านต้องมากกว่า 8 ตัวอักษร
        </p>
      </span>
      <span className="flex items-center gap-2">
        {/[A-Za-z]/.test(password) ? (
          <FaCheck size={13} color="green" />
        ) : (
          <FaTimes size={13} color="red" />
        )}
        <p
          className={`text-sm ${
            /[A-Za-z]/.test(password) ? "text-green-600" : "text-red-600"
          }`}
        >
          รหัสผ่านพยัญชนะต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น
        </p>
      </span>
      <span className="flex items-center gap-2">
        {/[^A-Za-z0-9]/.test(password) ? (
          <FaCheck size={13} color="green" />
        ) : (
          <FaTimes size={13} color="red" />
        )}
        <p
          className={`text-sm ${
            /[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-red-600"
          }`}
        >
          รหัสผ่านต้องประกอบด้วยอักขระพิเศษอย่างน้อย 1 ตัว
        </p>
      </span>
      <span className="flex items-center gap-2">
        {/\d/.test(password) ? (
          <FaCheck size={13} color="green" />
        ) : (
          <FaTimes size={13} color="red" />
        )}
        <p
          className={`text-sm ${
            /\d/.test(password) ? "text-green-600" : "text-red-600"
          }`}
        >
          รหัสผ่านต้องประกอบด้วยตัวเลขอย่างน้อย 1 ตัว
        </p>
      </span>
    </div>
  );
};
export default PasswordRules;
