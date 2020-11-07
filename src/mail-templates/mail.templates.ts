export const verifyTemplate = `
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all padding="0px"></mj-all>
      <mj-text font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="0 25px" font-size="13px"></mj-text>
      <mj-section background-color="#ffffff"></mj-section>
      <mj-class name="preheader" color="#000000" font-size="11px"></mj-class>
    </mj-attributes>
    <mj-style inline="inline">a { text-decoration: none!important; color: inherit!important; }</mj-style>
  </mj-head>
  <mj-body background-color="#041a2f">
    <mj-section>
      <mj-column width="100%">
        <mj-image src="https://res.cloudinary.com/du7xgj6ms/image/upload/v1601350874/mail/healthy-header-mail_yutzcs.png" alt="header image" padding="0px"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section padding-bottom="20px" padding-top="10px" background-color="#03111f">
      <mj-column>
        <mj-text align="center" padding="10px 25px" font-size="20px" color="#FFFF"><strong>Hola {{nameOrUsername}}!</strong></mj-text>
        <mj-text align="center" font-size="18px" font-family="Arial" color="#FFFF">Muchas gracias por registrarte en Healthy Dev<br/> Por favor presiona en el botón para activar tu cuenta</mj-text>
        <mj-button background-color="#f4dd27" color="#FFFFFF" href="{{activationLink}}" font-family="Arial, sans-serif" padding="20px 0 0 0" font-weight="bold" font-size="16px">Activar cuenta</mj-button>
        <mj-text align="center" color="#FFFF" font-size="14px" font-family="Arial, sans-serif" padding-top="40px">Healthy Dev es un proyecto de la comunidad FrontEnd Cafe
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

export const infoTemplate = `
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all padding="0px"></mj-all>
      <mj-text font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="0 25px" font-size="13px"></mj-text>
      <mj-section background-color="#FFF"></mj-section>
      <mj-class name="preheader" color="#000" font-size="11px"></mj-class>
    </mj-attributes>
    <mj-style inline="inline">a { text-decoration: none!important; color: inherit!important; }</mj-style>
  </mj-head>
  <mj-body background-color="#041A2F">
    <mj-section>
      <mj-column width="100%">
        <mj-image src="https://res.cloudinary.com/du7xgj6ms/image/upload/v1601350874/mail/healthy-header-mail_yutzcs.png" alt="header image" padding="0px"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section padding-bottom="20px" padding-top="10px" background-color="#03111F">
      <mj-column>
        <mj-text align="center" padding="10px 25px" font-size="20px" color="#FFF"><strong>Hola {{nameOrUsername}}!</strong></mj-text>
        <mj-text align="center" font-size="18px" font-family="Arial" color="#FFF">Muchas gracias por ingresar a Healthy Dev<br/> Si quieres crear una contraseña para ingresar solo con tu mail, haz click en el siguiente boton</mj-text>
        <mj-button background-color="#F4DD27" color="#FFF" href="{{resetPasswordLink}}" font-family="Arial, sans-serif" padding="20px 0 20px 0" font-weight="bold" font-size="16px">Crear Contraseña</mj-button>
        <mj-text align="center" font-size="12px" font-family="Arial" color="#FFF">Si usted no solicitó la creación de la cuenta, por favor presione 
         <span style="color:red;"> <a href="{{deleteLink}}" style="text-decoration: none; color: inherit;">aquí</a></span> para eliminar la cuenta, disculpe las molestias.</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#06393e" padding-bottom="20px" padding-top="0">
      <mj-column>
        <mj-image src="https://res.cloudinary.com/du7xgj6ms/image/upload/v1604704342/mail/logo_h5ufs1.png" alt="FrontEndCafe logo" align="center" border="none" width="50px" padding-left="0px" padding-right="0px" padding-bottom="0px" padding-top="10px"></mj-image>
      </mj-column>
      <mj-column>
        <mj-text align="center" color="#fff" font-size="13px" padding-left="25px" padding-right="25px" padding-bottom="0px" padding-top="0">
          <p>Healthy Dev es un proyecto de <a href="https://frontend.cafe/" style="text-decoration: none; color: inherit;">FrontEndCafé</a></p>
        </mj-text>
      </mj-column>
      <mj-column>
        <mj-social padding-top="20px">
          <mj-social-element padding="5px" name="twitter-noshare" href="https://twitter.com/FrontEndCafe"></mj-social-element>
          <mj-social-element padding="5px" name="github-noshare" href="http://github.com/frontend-cafe"></mj-social-element>
          <mj-social-element padding="5px" name="linkedin-noshare" href="https://www.linkedin.com/company/frontendcafe"></mj-social-element>
          <mj-social-element padding="5px" name="youtube-noshare" href="https://www.youtube.com/channel/UCUdXQMrVjrMMWG5NOZFpHqQ"></mj-social-element>
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;
