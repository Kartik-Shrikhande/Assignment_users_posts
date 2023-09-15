//Validations using  Regex
//--------------------------Validation for Name -----------------------------------------------------------------------------//
const validname = (text) => {
    const check = /^[a-zA-Z ]*$/
    return check.test(text)
  }
  
  //-------------------------------Validation for Email -------------------------------------------------------------------------------------//
  function validEmail(email) {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z-]+\.[a-zA-Z-.]+$/
    return emailRegex.test(email)
  }

  //------------------------------regex for only letter and digit----------------------------------------------------------------------------//
function validMobileNum(value) {
    const strdigi = /^\d{10}$/
    return strdigi.test(value)
  }
  
  //------------------------------Validation for Password----------------------------------------------------------------------------------//
  function validPassword(password) {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/
    return passwordRegex.test(password)
  }

 //-------------------------------------------------------------------------------------------------------------------------------------//
  
  module.exports = {validname, validEmail,validMobileNum, validPassword }