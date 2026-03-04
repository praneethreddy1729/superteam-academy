import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const course = searchParams.get("course") ?? "Certificate of Completion";
  const recipient = searchParams.get("recipient") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080C",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Purple glow top-left */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(153,69,255,0.20) 0%, transparent 70%)",
          }}
        />
        {/* Green glow bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,241,149,0.14) 0%, transparent 70%)",
          }}
        />
        {/* Border */}
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "2px solid #9945FF",
            borderRadius: "20px",
          }}
        />
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: "50px",
            top: "80px",
            width: "5px",
            height: "470px",
            background: "linear-gradient(to bottom, #9945FF, #14F195)",
            borderRadius: "3px",
          }}
        />

        {/* App name */}
        <div
          style={{
            color: "rgba(160,160,176,0.8)",
            fontSize: "16px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "16px",
            display: "flex",
          }}
        >
          SUPERTEAM ACADEMY
        </div>

        {/* Title */}
        <div
          style={{
            color: "#ffffff",
            fontSize: "52px",
            fontWeight: 700,
            marginBottom: "12px",
            display: "flex",
          }}
        >
          Certificate of Completion
        </div>

        {/* Divider */}
        <div
          style={{
            width: "600px",
            height: "1.5px",
            background: "linear-gradient(to right, transparent, #9945FF, #14F195, transparent)",
            marginBottom: "24px",
            display: "flex",
          }}
        />

        {/* Recipient */}
        {recipient && (
          <div
            style={{
              color: "#a0a0b0",
              fontSize: "18px",
              marginBottom: "8px",
              display: "flex",
            }}
          >
            Awarded to:{" "}
            <span style={{ color: "#14F195", marginLeft: "8px", fontFamily: "monospace" }}>
              {recipient}
            </span>
          </div>
        )}

        {/* Course name */}
        <div
          style={{
            color: "#ffffff",
            fontSize: "32px",
            fontWeight: 600,
            maxWidth: "900px",
            textAlign: "center",
            display: "flex",
          }}
        >
          {course}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "52px",
            color: "#a0a0b0",
            fontSize: "13px",
            display: "flex",
          }}
        >
          Verified on Solana Blockchain  •  Powered by Metaplex Core
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
