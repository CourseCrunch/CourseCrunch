export default class TransporterSingleton{
    constructor(){
        this.transporter = null;
    }

    getTransporter(){
        if(!this.transporter){
            this.transporter = createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: {
                  user: process.env.EMAILUSER,
                  pass: process.env.EMAILPWD
                }
            });
        }
        return this.transporter;
    }

}