import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

export const generateQrcode = async (number, amount) => {
  const payload = generatePayload(number, {
    amount,
  });

  const canvas = document.createElement("canvas");

  await QRCode.toCanvas(canvas, payload);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );

  return blob;
};
