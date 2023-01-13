export default function Home() {
  return (
    <>
      <div className='flex flex-col items-center justify-center text-center'>
        <h1 className='mb-6 text-6xl'>HOME</h1>
        <a className='p-3 my-5 text-3xl bg-blue-500' href='/profile'>
          Go to profilee
        </a>
        <img
          src={`http://${'127.0.0.1'}:9000/mybucket/background`}
          alt='nextjs'
          width={800}
        />
      </div>
    </>
  );
}
