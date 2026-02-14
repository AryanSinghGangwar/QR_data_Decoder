"use client";

import { useState, useRef } from "react";
import { QrReader } from "react-qr-reader";

export default function Home() {
  const [data, setData] = useState("");
  const [scanned, setScanned] = useState(false);
  const scannedRef = useRef(false);

  const beep = () => {
    const audio = new Audio("/beep.mp3");
    audio.play();
  };

  const handleScan = (result, error) => {
    if (!!result && !scannedRef.current) {
      scannedRef.current = true;
      const text = result?.text;
      setData(text);
      setScanned(true);
      beep();
    }
  };

  const nextScan = () => {
    setData("");
    setScanned(false);
    scannedRef.current = false;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎟 QR SCANNER</h1>

      {!scanned && (
        <div style={styles.scanner}>
          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={handleScan}
            style={{ width: "100%" }}
          />
        </div>
      )}

      {scanned && (
        <div style={styles.resultBox}>
          <h2>Scanned Data:</h2>
          <div style={styles.data}>{data}</div>

          <button onClick={nextScan} style={styles.button}>
            Next Scan
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "black",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "red",
  },
  scanner: {
    width: "320px",
    border: "3px solid red",
    borderRadius: "20px",
    overflow: "hidden",
  },
  resultBox: {
    textAlign: "center",
    background: "#111",
    padding: "30px",
    borderRadius: "20px",
    width: "350px",
  },
  data: {
    marginTop: "15px",
    background: "#000",
    padding: "15px",
    borderRadius: "10px",
    color: "#00ff9c",
    wordBreak: "break-all",
  },
  button: {
    marginTop: "20px",
    padding: "12px 25px",
    fontSize: "16px",
    background: "red",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
  },
};
