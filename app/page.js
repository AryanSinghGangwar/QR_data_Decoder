"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function Home() {
  const scannerRef = useRef(null);
  const runningRef = useRef(false);

  const [parsed, setParsed] = useState({});
  const [scanned, setScanned] = useState(false);

  const beep = () => {
    const audio = new Audio("/beep.mp3");
    audio.play();
  };

  // ✅ Correct parser (handles full names with spaces)
  const parseData = (text) => {
  const obj = {};

  // split by line OR space
  const parts = text.split(/\n|,/).map(p => p.trim());

  parts.forEach((item) => {
    if (item.toLowerCase().startsWith("name:"))
      obj.name = item.split(":")[1]?.trim();

    if (item.toLowerCase().startsWith("phone:"))
      obj.phone = item.split(":")[1]?.trim();

    if (item.toLowerCase().startsWith("email:"))
      obj.email = item.split(":")[1]?.trim();

    if (item.toLowerCase().startsWith("enroll:"))
      obj.enroll = item.split(":")[1]?.trim();
  });

  return obj;
};

  useEffect(() => {
    if (scanned) return;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const start = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            setParsed(parseData(decodedText));
            setScanned(true);
            beep();
            stop();
          }
        );
        runningRef.current = true;
      } catch (e) {
        console.log(e);
      }
    };

    const stop = async () => {
      if (runningRef.current && scannerRef.current) {
        try {
          await scannerRef.current.stop();
          await scannerRef.current.clear();
        } catch {}
        runningRef.current = false;
      }
    };

    start();
    return () => stop();
  }, [scanned]);

  const nextScan = () => {
    setParsed({});
    setScanned(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🎟 CONSO ENTRY SCANNER</h1>

      {!scanned && <div id="reader" style={styles.scanner}></div>}

      {scanned && (
        <div style={styles.pass}>
          <div style={styles.passHeader}>ENTRY PASS</div>

          <div style={styles.row}>
            <span style={styles.label}>👤 NAME</span>
            <span style={styles.value}>{parsed.name}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>🆔 ENROLL</span>
            <span style={styles.value}>{parsed.enroll}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>📞 PHONE</span>
            <span style={styles.value}>{parsed.phone}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>✉ EMAIL</span>
            <span style={styles.value}>{parsed.email}</span>
          </div>

          <div style={styles.success}>✔ SCANNED SUCCESSFULLY</div>

          <button onClick={nextScan} style={styles.button}>
            NEXT SCAN
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "radial-gradient(circle at center, #111 0%, #000 100%)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui",
  },
  header: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#ff2e2e",
    letterSpacing: "2px",
  },
  scanner: {
    width: "340px",
  },
  pass: {
    width: "380px",
    background: "linear-gradient(180deg,#0a0a0a,#111)",
    borderRadius: "18px",
    padding: "30px",
    boxShadow: "0 0 40px rgba(255,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  passHeader: {
    textAlign: "center",
    fontSize: "22px",
    marginBottom: "25px",
    color: "#00ff9c",
    letterSpacing: "3px",
    fontWeight: "bold",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "14px",
    paddingBottom: "10px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  label: {
    color: "#888",
    fontSize: "13px",
    letterSpacing: "1px",
  },
  value: {
    fontWeight: "bold",
    color: "white",
  },
  success: {
    textAlign: "center",
    marginTop: "18px",
    color: "#00ff9c",
    fontWeight: "bold",
    letterSpacing: "2px",
  },
  button: {
    width: "100%",
    marginTop: "22px",
    padding: "14px",
    fontSize: "16px",
    background: "#ff2e2e",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
};
