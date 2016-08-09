import { SecurityDataAccess } from '../../dataaccess/security/security.dataaccess';
import { MemberDataAccess } from '../../dataaccess/member/member.dataaccess';
import { UnderlyingAccountDataAccess } from '../../dataaccess/underlyingaccount/underlyingAccount.dataaccess';
import { Token } from '../../models/security/token';
import { Credentials } from '../../models/security/credentials';
import { Member } from '../../models/member/member';
import { UnderlyingAccount } from '../../models/underlyingaccount/underlyingaccount';

export class SecurityService {
    securityDataAccess: SecurityDataAccess;
    memberDataAccess: MemberDataAccess;
    underlyingAccountDataAccess: UnderlyingAccountDataAccess;

    init() {
        this.securityDataAccess = new SecurityDataAccess();
        this.memberDataAccess = new MemberDataAccess();
        this.underlyingAccountDataAccess = new UnderlyingAccountDataAccess();
        this.securityDataAccess.init();
        this.memberDataAccess.init();
        this.underlyingAccountDataAccess.init();
    }

    login(credentials: Credentials, callback) {
        let self = this;

        this.memberDataAccess.findByField({ email: credentials.email }, function (err, members) {
            let member = members[0];

            let token = new Token();
            token.memberId = member.id;
            token.accounts = [];

            self.underlyingAccountDataAccess.find(member.id, function (err, accounts) {
                accounts.forEach(account => {
                    token.accounts.push(account.id);
                });

                self.securityDataAccess.saveToken(token, function (err, token) {
                    callback(err, token);
                });

            });


        });
    }

    getToken(tokenString: string, callback) {
        let self = this;

        this.securityDataAccess.findById(tokenString, function (err, token: Token) {
            callback(err, token);
        });
    }

}