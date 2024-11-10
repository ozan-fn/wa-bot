import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

// Menginisialisasi client WhatsApp dengan autentikasi lokal
const client = new Client({
	authStrategy: new LocalAuth(),
});

// Menampilkan kode QR di terminal untuk autentikasi
client.on("qr", (qr) => {
	qrcode.generate(qr, { small: true });
	console.log("Scan the QR code to log in.");
});

// Menangani event saat client terautentikasi
client.on("ready", () => {
	console.log("Client is ready!");
});

// Menangani pesan masuk
client.on("message", async (message) => {
	try {
		if (message.type === "document") {
			const media = await message.downloadMedia();
			if (media && media.mimetype.startsWith("video/")) {
				console.log(`Received document containing video from ${message.from}: ${media.filename}`);
				const forwardedMessage = new MessageMedia(media.mimetype, media.data, media.filename);
				console.log(`Forwarding video to ${message.from}`);
				await client.sendMessage(message.from, forwardedMessage);
				console.log(`Forwarded video back to ${message.from}`);
			} else {
				console.log(`Received document, but it's not a video: ${media.mimetype}`);
			}
		} else {
			console.log(`Received non-document message from ${message.from}: ${message.body}`);
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Failed to process message: ${error.message}`);
		}
	}
});

// Menginisialisasi koneksi ke WhatsApp
client.initialize();
