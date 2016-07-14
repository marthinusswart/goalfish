import { SecurityDataAccess } from '../../dataaccess/security/security.dataaccess';
import { Token } from '../../models/security/token';

export class SecurityService {
    securityDataAccess: SecurityDataAccess;

    init() {
        this.securityDataAccess = new SecurityDataAccess();
        this.securityDataAccess.init();
    }

}