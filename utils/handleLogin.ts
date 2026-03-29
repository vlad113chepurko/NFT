export const handleLogin = async ({ setLoading, router }: any) => {
  try {
    setLoading(true);

    const provider = (window as any).solana;

    if (!provider?.isPhantom) {
      alert("Install Phantom");
      return;
    }

    const resp = await provider.connect();
    const wallet = resp.publicKey.toString();

    const message = `Login to NFT Store`;
    const encodedMessage = new TextEncoder().encode(message);
    const signed = await provider.signMessage(encodedMessage, "utf8");

    const res = await fetch("/api/auth/web3", {
      method: "POST",
      body: JSON.stringify({
        wallet,
        message,
        signature: Array.from(signed.signature),
      }),
    });

    const data = await res.json();

    if (data) {
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    }
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
};
