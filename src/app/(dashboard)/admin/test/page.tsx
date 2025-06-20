import Image from "next/image";

export default function TestPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Image Test</h1>
      <Image src="/images/login_banner.png" alt="Test"width="100"  height="100"style={{ width: '200px' }} />
    </div>
  );
}
