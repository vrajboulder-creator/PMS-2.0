const BoulderLogo = ({ height = 24, showSub = false }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: showSub ? "center" : "flex-start" }}>
    <span style={{
      fontSize: height,
      fontWeight: 900,
      fontFamily: "'Geist', 'Arial Black', 'Impact', sans-serif",
      color: "transparent",
      WebkitTextStroke: `${Math.max(1.5, height / 14)}px #E8793A`,
      letterSpacing: "0.04em",
      lineHeight: 1,
      textTransform: "uppercase",
    }}>BOULDER</span>
    {showSub && <span style={{
      fontSize: Math.max(9, height / 4),
      fontWeight: 600,
      color: "#9ca1ab",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginTop: 4,
    }}>Project Management System</span>}
  </div>
);

export default BoulderLogo;
