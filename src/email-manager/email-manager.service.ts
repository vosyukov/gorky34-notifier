import * as imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { Injectable } from '@nestjs/common';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

@Injectable()
export class EmailManagerService {
  constructor() {
    imaps
      .connect({
        imap: {
          user: 'o123',
          password: '123',
          host: 'imap.yandex.ru',
          port: 993,
          tls: true,
          authTimeout: 3000,
        },
        onmail: (numNewMail) => {
          console.log(numNewMail);
        },
      })
      .then((connection) =>
        connection.openBox('INBOX').then(() => {
          const searchCriteria = ['ALL'];
          const fetchOptions = { bodies: ['TEXT', 'HEADER'], struct: true };
          return connection.search(searchCriteria, fetchOptions);
        }),
      )
      .then(function (messages) {
        messages.map((item) => {
          const id = item.attributes.uid;
          const idHeader = 'Imap-Id: ' + id + '\r\n';
          simpleParser(idHeader + item.parts[0].body, (err, mail) => {
            // access to the whole mail object
            // console.log(mail.subject);
            // console.log(mail);
          });
        });
      });
  }
}
