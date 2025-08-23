import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© {new Date().getFullYear()} Omer Kasapoglu. Tüm hakları saklıdır.</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#222",
    color: "#fff",
    textAlign: "center",
    padding: "15px 0",
    marginTop: "auto",
  },
};

export default Footer;
