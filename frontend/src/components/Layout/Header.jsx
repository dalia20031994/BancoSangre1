import logoImg from '../../assets/logo.png';

const HeaderLogo = () => (
  <div className="flex items-center gap-6">
    <img src={logoImg} alt="Logo" className="h-16" />
    <div className="text-center">
      <h1 className="text-2xl font-bold text-teal-700 leading-tight">Banco de Sangre</h1>
      <p className="text-lg text-gray-600 font-bold">Ángeles</p>
    </div>
  </div>
);

export default HeaderLogo;
