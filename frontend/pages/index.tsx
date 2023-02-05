import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className='flex flex-col items-center justify-center text-center'>
        <h1 className='mb-6 text-6xl'>HOME</h1>
        <Link className='p-3 my-5 text-3xl bg-blue-500' href={'/profile'}>
          Go to profilee
        </Link>
        <img
          src={`${process.env.NEXT_PUBLIC_S3_HOSTNAME}/mybucket/background`}
          alt='nextjs'
          width={300}
        />
      </div>
    </>
  );
}
