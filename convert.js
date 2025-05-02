/* global DOMParser, Blob */
(() => {
    "use strict";
  
    /* -------------------- DOM -------------------- */
    const $ = (sel) => document.querySelector(sel);
    const input      = $("#inputText");
    const output     = $("#outputText");
    const fileInput  = $("#fileInput");
    const convertBtn = $("#convertBtn");
    const copyBtn    = $("#copyBtn");
    const dlLink     = $("#downloadLink");
  
    /* ------------------ constants ---------------- */
    const PLIST_HEADER =
  `<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" \
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
  <array>
  `;
    const PLIST_FOOTER = "</array>\n</plist>\n";
  
    /* ------------------ utilities ---------------- */
    const xmlEscape = (str) =>
      str.replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/'/g, "&apos;")
         .replace(/"/g, "&quot;");
  
    const getMode = () => document.querySelector('[name="mode"]:checked').value;
  
    const showDownload = (blob, filename) => {
      dlLink.download = filename;
      dlLink.href = URL.createObjectURL(blob);
    };
  
    /* ---------------- file handler ---------------- */
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { input.value = reader.result; };
      reader.readAsText(file);
  
      // 自動切替
      const ext = file.name.split(".").pop().toLowerCase();
      if (ext === "plist") $("input[value='MAC2IME']").checked = true;
      else $("input[value='IME2MAC']").checked = true;
    });
  
    /* --------------- conversion core ------------- */
    const ime2mac = (src) => {
      const lines = src.split(/\r?\n/);
      const dicts = lines.flatMap((line) => {
        const [shortcut, phrase] = line.split("\t");
        if (!shortcut || !phrase) return [];
        // NG ワードチェック
        if (/[<>]/.test(shortcut + phrase)) return [];
        return { shortcut, phrase };
      });
  
      const body = dicts.map(
        ({ shortcut, phrase }) => `  <dict>
      <key>phrase</key><string>${xmlEscape(phrase)}</string>
      <key>shortcut</key><string>${xmlEscape(shortcut)}</string>
    </dict>`
      ).join("\n");
  
      return PLIST_HEADER + body + "\n" + PLIST_FOOTER;
    };
  
    /* ----- 修正版：Mac (plist) → IME (txt) ------ */
    const mac2ime = (src) => {
      const result = [];
      let xml;
  
      try {
        xml = new DOMParser().parseFromString(src, "text/xml");
      } catch (err) {
        console.error(err);
        alert("XML を解析できませんでした");
        return "";
      }
  
      if (xml.querySelector("parsererror")) {
        alert("plist の構文が正しくありません");
        return "";
      }
  
      xml.querySelectorAll("plist > array > dict").forEach((dict) => {
        let phrase = "";
        let shortcut = "";
  
        // <dict><key>..</key><string>..</string>...</dict>
        const kids = dict.children;
        for (let i = 0; i < kids.length - 1; i++) {
          const keyNode = kids[i];
          const valNode = kids[i + 1];
          if (keyNode.tagName !== "key" || valNode.tagName !== "string") continue;
  
          switch (keyNode.textContent.trim()) {
            case "phrase":
              phrase = valNode.textContent.trim();
              break;
            case "shortcut":
              shortcut = valNode.textContent.trim();
              break;
          }
        }
  
        if (phrase && shortcut && !/[<>]/.test(phrase + shortcut)) {
          // Google 日本語入力互換のタブ区切り形式
          result.push(`${shortcut}\t${phrase}\t名詞\t`);
        }
      });
  
      return result.join("\n");
    };
  
    /* -------------- event: convert --------------- */
    convertBtn.addEventListener("click", () => {
      const mode = getMode();
      const src  = input.value.trim();
      if (!src) {
        alert("入力が空です");
        return;
      }
      const result = mode === "IME2MAC" ? ime2mac(src) : mac2ime(src);
      output.value = result;
  
      // download link
      const blob = new Blob([result], { type: "text/plain" });
      showDownload(blob, mode === "IME2MAC" ? "userdict.plist" : "userdict.txt");
    });
  
    /* ------------- clipboard support ------------- */
    copyBtn.addEventListener("click", async () => {
      if (!output.value) {
        alert("出力がありません");
        return;
      }
      try {
        await navigator.clipboard.writeText(output.value);
        copyBtn.textContent = "コピー済み！";
        setTimeout(() => (copyBtn.textContent = "コピー"), 1500);
      } catch {
        alert("クリップボードに書き込めませんでした");
      }
    });
  
    /* --------- drag & drop (optional) ------------ */
    ["dragover", "drop"].forEach((evtName) =>
      document.addEventListener(evtName, (e) => e.preventDefault())
    );
    document.addEventListener("drop", (e) => {
      const f = e.dataTransfer.files[0];
      if (f) {
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event("change"));
      }
    });
  })();
  