import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

export const generateQrcode = async (number, amount) => {
  const payload = generatePayload(number, {
    amount: Number(amount) || 0,
  });

  const canvas = document.createElement("canvas");

  await QRCode.toCanvas(canvas, payload, {
    width: 300,
    margin: 2,
  });

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );

  return new File([blob], `promptpay_${number}_${Date.now()}.png`, {
    type: "image/png",
  });
};
