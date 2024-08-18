import SignInForm from './SigninForm';
import logo from '../../Image/logo-2.png'

const SignIn = () => {
  return (
    <>
    <div className='w-[100vw] h-[100vh] flex justify-center items-center'>
      <div className='w-[496px]'>
        <img src={logo} alt="logo" className='h-8 w-auto mb-2' />
        <h2 className='text-xl font-semibold mb-2'>Welcome to PROCG-POC Project</h2>
        <SignInForm/>
        <div className='flex justify-between items-center mt-4'>
          <div className='bg-slate-300 h-[2px] w-[198px]'></div>
          <p className='text-slate-400'>OR</p>
          <div className='bg-slate-300 h-[2px] w-[198px]'></div>
        </div>
        <button className="w-full h-[2.2rem] rounded-md bg-dark-400 hover:bg-dark-400/90 text-white mt-4">
          Continue with SSO
        </button>
        <div className='bg-[#D9D7D7] w-full px-4 py-2 rounded-md mt-4'>
          <p>By clicking Continue, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default SignIn
