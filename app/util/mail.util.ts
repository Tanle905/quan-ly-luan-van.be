import { createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

const transport = createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "2f0c61e30aaf39",
    pass: "29e9c9cbe5263d",
  },
});

export function sendEmail(receiverMail: any, subject: any, content: any) {
  const mainOptions: MailOptions = {
    from: "Quản lý luận văn",
    to: receiverMail,
    html: content,
  };

  transport.sendMail(mainOptions, (err, info) => {});
}

export function commonEmailContent(header, content) {
  return `<div style="padding: 10px; background-color: #003375">
  <div style="padding: 10px; background-color: white;">
      <h4 style="color: #0085ff">${header}</h4>
      <span style="color: black">${content}</span>
  </div>
</div>`;
}

export function sendRequestEmailContent(teacherName, studentName, MSSV) {
  return `<div style="padding: 10px; background-color: #003375">
  <div style="padding: 10px; background-color: white;">
      <h4 style="color: #0085ff">Xin chào ${teacherName}</h4>
      <span style="color: black">Sinh viên ${studentName} - ${MSSV} đã gửi yêu cầu thực hiện luận văn</span>
  </div>
</div>`;
}

export function haveScheduleEmailContent(studentName, time, date) {
  return `<div style="padding: 10px; background-color: #003375">
  <div style="padding: 10px; background-color: white;">
      <h4 style="color: #0085ff">Xin chào ${studentName}</h4>
      <span style="color: black">bạn có lịch báo cáo vào ${time} ngày ${date}</span>
  </div>
</div>`;
}
