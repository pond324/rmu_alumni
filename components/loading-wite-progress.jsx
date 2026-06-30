import { Loader2 } from "lucide-react";
import Modal from "./modal";
import ProgressbarDowload from "./progressbar-dowload";

const LoadingWithProgess = ({
  isOpen,
  loadingText,
  remark,
  percent,
  afterLoad,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <div className="z-50 text-center p-16 bg-white rounded-lg px-20 gap-2 flex items-center flex-col">
        <Loader2 size={45} className="animate-spin" color="blue" />
        <p>{loadingText}</p>
        {remark && <p className="text-sm text-gray-600">{remark || ""}</p>}

        <ProgressbarDowload progress={percent} />
        <p className="text-sm text-gray-600">โปรดรออยู่หน้านี้สักครู่</p>
        {percent > 99 && (
          <p className="text-sm text-gray-600">
            {afterLoad || "กำลังประมวลผล..."}
          </p>
        )}
      </div>
    </Modal>
  );
};
export default LoadingWithProgess;
