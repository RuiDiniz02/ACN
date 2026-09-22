/* @ds-bundle: {"format":4,"namespace":"ACNCuttingSystemsDesignSystem_e492c6","components":[{"name":"Callout","sourcePath":"components/editorial/Callout.jsx"},{"name":"ProductBlock","sourcePath":"components/editorial/ProductBlock.jsx"},{"name":"SectionCover","sourcePath":"components/editorial/SectionCover.jsx"},{"name":"StatBlock","sourcePath":"components/editorial/StatBlock.jsx"},{"name":"TechnicalTable","sourcePath":"components/editorial/TechnicalTable.jsx"}],"sourceHashes":{"components/editorial/Callout.jsx":"5379020f359a","components/editorial/ProductBlock.jsx":"d3cdfdaf2b4e","components/editorial/SectionCover.jsx":"adef3450d51a","components/editorial/StatBlock.jsx":"d6b4d536afe6","components/editorial/TechnicalTable.jsx":"722e3e572280"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ACNCuttingSystemsDesignSystem_e492c6 = window.ACNCuttingSystemsDesignSystem_e492c6 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/editorial/Callout.jsx
try { (() => {
/* Callout — pull-quote or emphasis block, set off with a rule (not a filled box), matching the
   manual's flat, no-shadow, no-rounded-card aesthetic. Used for quotes, warnings, or key takeaways. */
function Callout({
  children,
  tone = "quote",
  attribution
}) {
  const tones = {
    quote: {
      ruleColor: "var(--acn-blue)",
      textColor: "var(--text-primary)"
    },
    note: {
      ruleColor: "var(--neutral-600)",
      textColor: "var(--text-secondary)"
    },
    warning: {
      ruleColor: "var(--signal-amber)",
      textColor: "var(--text-primary)"
    }
  };
  const t = tones[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-family-body)",
      borderLeft: `4px solid ${t.ruleColor}`,
      paddingLeft: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 500,
      lineHeight: 1.5,
      color: t.textColor
    }
  }, children), attribution && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontSize: 12,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--text-tertiary)"
    }
  }, attribution));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/Callout.jsx", error: String((e && e.message) || e) }); }

// components/editorial/ProductBlock.jsx
try { (() => {
/* ProductBlock — the repeating unit of a product/corporate catalogue: image, name, one-line descriptor,
   and a short spec teaser. Used in grids (catalogue index) or full-width (datasheet header). */
function ProductBlock({
  image,
  eyebrow,
  name,
  descriptor,
  specs = [],
  layout = "grid"
}) {
  const isRow = layout === "row";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: isRow ? "row" : "column",
      gap: isRow ? "var(--space-8)" : "var(--space-4)",
      fontFamily: "var(--font-family-body)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--neutral-050)",
      flex: isRow ? "0 0 44%" : "none",
      aspectRatio: isRow ? "auto" : "4 / 3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-6)",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "contain"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "var(--acn-blue)",
      marginBottom: 6
    }
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-family-display)",
      fontWeight: 700,
      fontSize: isRow ? 30 : 20,
      letterSpacing: "-0.01em",
      marginBottom: 6,
      color: "var(--text-primary)"
    }
  }, name), descriptor && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--text-secondary)",
      lineHeight: 1.5,
      marginBottom: specs.length ? 12 : 0,
      maxWidth: "42ch"
    }
  }, descriptor), specs.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px 20px"
    }
  }, specs.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    style: {
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-tertiary)"
    }
  }, s.label, " "), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, s.value))))));
}
Object.assign(__ds_scope, { ProductBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/ProductBlock.jsx", error: String((e && e.message) || e) }); }

// components/editorial/SectionCover.jsx
try { (() => {
/* SectionCover — full-bleed section/divider block for catalogues, brand guideline chapters, and deck section slides.
   Solid brand-blue or dark ground, kicker + big title, optional page number. Not a UI component — a print/deck layout block. */
function SectionCover({
  kicker,
  title,
  number,
  tone = "blue",
  image
}) {
  const tones = {
    blue: {
      background: "var(--acn-blue)",
      color: "#fff",
      kickerColor: "rgba(255,255,255,.65)"
    },
    dark: {
      background: "var(--neutral-900)",
      color: "#fff",
      kickerColor: "var(--neutral-400)"
    },
    light: {
      background: "var(--surface-page)",
      color: "var(--text-primary)",
      kickerColor: "var(--acn-blue)"
    }
  };
  const t = tones[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: "16 / 9",
      background: t.background,
      color: t.color,
      overflow: "hidden",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0 8%",
      fontFamily: "var(--font-family-body)"
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: 0.28
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, number && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-family-display)",
      fontWeight: 800,
      fontSize: "1.4vw",
      opacity: 0.5,
      marginBottom: "1.2vw"
    }
  }, number), kicker && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "1vw",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: t.kickerColor,
      marginBottom: "1vw"
    }
  }, kicker), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-family-display)",
      fontWeight: 800,
      fontSize: "4.2vw",
      lineHeight: 1.02,
      letterSpacing: "-0.01em",
      maxWidth: "16ch"
    }
  }, title)));
}
Object.assign(__ds_scope, { SectionCover });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/SectionCover.jsx", error: String((e && e.message) || e) }); }

// components/editorial/StatBlock.jsx
try { (() => {
/* StatBlock — big-number infographic unit for capability/performance callouts (row of 2-4 stats). */
function StatBlock({
  stats = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      fontFamily: "var(--font-family-body)"
    }
  }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    style: {
      flex: 1,
      padding: "0 24px",
      borderLeft: i === 0 ? "none" : "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-family-display)",
      fontWeight: 800,
      fontSize: 40,
      color: "var(--acn-blue)",
      letterSpacing: "-0.01em",
      lineHeight: 1
    }
  }, s.value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--text-tertiary)",
      marginTop: 8
    }
  }, s.label))));
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/StatBlock.jsx", error: String((e && e.message) || e) }); }

// components/editorial/TechnicalTable.jsx
try { (() => {
/* TechnicalTable — spec/dimension table for datasheets. Hairline rows, no shading, label column
   in secondary text, value column bold — matches the manual's flat, engineering-drawing feel. */
function TechnicalTable({
  title,
  rows = [],
  footnote
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-family-body)"
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "var(--text-tertiary)",
      borderBottom: "2px solid var(--neutral-900)",
      paddingBottom: 8,
      marginBottom: 4
    }
  }, title), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.label,
    style: {
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 0",
      color: "var(--text-secondary)",
      width: "44%"
    }
  }, r.label), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 0",
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, r.value))))), footnote && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-tertiary)",
      marginTop: 10
    }
  }, footnote));
}
Object.assign(__ds_scope, { TechnicalTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/TechnicalTable.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.ProductBlock = __ds_scope.ProductBlock;

__ds_ns.SectionCover = __ds_scope.SectionCover;

__ds_ns.StatBlock = __ds_scope.StatBlock;

__ds_ns.TechnicalTable = __ds_scope.TechnicalTable;

})();
