export type Question = {
  id: number;
  text: string;
  options: { key: string; label: string }[];
  correctOption: string;
};

export const EXAM_DURATION_SECONDS = 2000; // 30 minutes

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "An employee receives an email claiming their mailbox is full and asks them to log in through a provided link. What should the employee do first?",
    options: [
      { key: "A", label: "Enter credentials immediately" },
      { key: "B", label: "Verify the request through official channels" },
      { key: "C", label: "Forward the email to everyone" },
      { key: "D", label: "Ignore all future emails" },
    ],
    correctOption: "B",
  },
  {
    id: 2,
    text: "A user receives a login notification for an account they do not remember accessing. What is the most appropriate concern?",
    options: [
      { key: "A", label: "Browser malfunction" },
      { key: "B", label: "Possible unauthorized account access" },
      { key: "C", label: "Hardware failure" },
      { key: "D", label: "Printer configuration issue" },
    ],
    correctOption: "B",
  },
  {
    id: 3,
    text: "A company's website suddenly becomes unavailable after receiving a large volume of traffic. What is the most likely explanation?",
    options: [
      { key: "A", label: "Database backup completed" },
      { key: "B", label: "Possible denial-of-service activity" },
      { key: "C", label: "Password policy changed" },
      { key: "D", label: "Software license expired" },
    ],
    correctOption: "B",
  },
  {
    id: 4,
    text: "An employee's account logs in from Chattogram at 10:00 AM and from London at 10:05 AM. What should this indicate?",
    options: [
      { key: "A", label: "Normal travel activity" },
      { key: "B", label: "Impossible travel requiring investigation" },
      { key: "C", label: "Browser cache issue" },
      { key: "D", label: "Internet outage" },
    ],
    correctOption: "B",
  },
  {
    id: 5,
    text: "Which observation is MOST suspicious?",
    options: [
      { key: "A", label: "One password reset request" },
      { key: "B", label: "One failed login" },
      { key: "C", label: "Hundreds of password reset requests for many users" },
      { key: "D", label: "Successful logout" },
    ],
    correctOption: "C",
  },
  {
    id: 6,
    text: "A workstation suddenly starts communicating with a previously unseen external IP address every hour. What should be investigated?",
    options: [
      { key: "A", label: "Potential command-and-control communication" },
      { key: "B", label: "Employee attendance records" },
      { key: "C", label: "Keyboard settings" },
      { key: "D", label: "Monitor brightness" },
    ],
    correctOption: "A",
  },
  {
    id: 7,
    text: "Which observation provides the strongest indication of unauthorized access?",
    options: [
      { key: "A", label: "Increased disk usage" },
      { key: "B", label: "New administrator account created unexpectedly" },
      { key: "C", label: "User changed wallpaper" },
      { key: "D", label: "Browser update installed" },
    ],
    correctOption: "B",
  },
  {
    id: 8,
    text: "You discover a vulnerability in a university portal. What is the most ethical response?",
    options: [
      { key: "A", label: "Sell the vulnerability" },
      { key: "B", label: "Share it publicly on social media" },
      { key: "C", label: "Report it through responsible disclosure channels" },
      { key: "D", label: "Exploit it for testing" },
    ],
    correctOption: "C",
  },
  {
    id: 9,
    text: "A colleague accidentally gains access to another student's records. What should they do?",
    options: [
      { key: "A", label: "Copy the records" },
      { key: "B", label: "Share screenshots" },
      { key: "C", label: "Stop accessing the records and report the issue" },
      { key: "D", label: "Ignore it completely" },
    ],
    correctOption: "C",
  },
  {
    id: 10,
    text: "You find a QR code sticker placed over an official payment QR code. What is the safest action?",
    options: [
      { key: "A", label: "Scan it immediately" },
      { key: "B", label: "Remove it and report it to staff" },
      { key: "C", label: "Share it online" },
      { key: "D", label: "Use it for testing" },
    ],
    correctOption: "B",
  },
  {
    id: 11,
    text: "An email claims to be from the IT department but contains multiple spelling errors and an unfamiliar domain. What should this trigger?",
    options: [
      { key: "A", label: "Immediate trust" },
      { key: "B", label: "Verification and scrutiny" },
      { key: "C", label: "Password disclosure" },
      { key: "D", label: "System shutdown" },
    ],
    correctOption: "B",
  },
  {
    id: 12,
    text: "Several employees report receiving calls asking for their passwords. What type of threat should be considered?",
    options: [
      { key: "A", label: "Social engineering" },
      { key: "B", label: "Hardware failure" },
      { key: "C", label: "Database maintenance" },
      { key: "D", label: "System update" },
    ],
    correctOption: "A",
  },
  {
    id: 13,
    text: "A new device appears on the corporate Wi-Fi network. What should be done first?",
    options: [
      { key: "A", label: "Block all network traffic immediately" },
      { key: "B", label: "Identify and verify the device owner" },
      { key: "C", label: "Ignore it" },
      { key: "D", label: "Replace the router" },
    ],
    correctOption: "B",
  },
  {
    id: 14,
    text: "All systems with unsupported software have increased security risk. Server X runs unsupported software. What must be true?",
    options: [
      { key: "A", label: "Server X has already been hacked" },
      { key: "B", label: "Server X has increased security risk" },
      { key: "C", label: "Server X is offline" },
      { key: "D", label: "Server X will fail tomorrow" },
    ],
    correctOption: "B",
  },
  {
    id: 15,
    text: "A laptop uses full-disk encryption and is stolen. Why might security staff still investigate?",
    options: [
      { key: "A", label: "Encryption prevents all risks" },
      { key: "B", label: "Credentials or active sessions may still be exposed" },
      { key: "C", label: "Encryption is useless" },
      { key: "D", label: "Theft is irrelevant" },
    ],
    correctOption: "B",
  },
  {
    id: 16,
    text: "A database server suddenly experiences high CPU usage. What should be concluded first?",
    options: [
      { key: "A", label: "Malware infection is confirmed" },
      { key: "B", label: "Hardware failure is confirmed" },
      { key: "C", label: "More evidence is needed before determining the cause" },
      { key: "D", label: "The server should be replaced" },
    ],
    correctOption: "C",
  },
  {
    id: 17,
    text: "Two vulnerabilities have equal CVSS scores. Which factor should most influence remediation order?",
    options: [
      { key: "A", label: "Vendor popularity" },
      { key: "B", label: "Business impact and exploitability" },
      { key: "C", label: "Patch file size" },
      { key: "D", label: "Number of users in IT" },
    ],
    correctOption: "B",
  },
  {
    id: 18,
    text: "An endpoint protection tool reports malware, but no supporting evidence is found. What is the best conclusion?",
    options: [
      { key: "A", label: "The alert is definitely false" },
      { key: "B", label: "The system is definitely compromised" },
      { key: "C", label: "Additional investigation is required" },
      { key: "D", label: "Malware has been removed" },
    ],
    correctOption: "C",
  },
  {
    id: 19,
    text: "Which evidence most strongly supports account compromise?",
    options: [
      { key: "A", label: "User forgot password" },
      { key: "B", label: "Login from an unfamiliar device followed by security setting changes" },
      { key: "C", label: "Browser crash" },
      { key: "D", label: "Antivirus update" },
    ],
    correctOption: "B",
  },
  {
    id: 20,
    text: "An attacker obtains administrator privileges. Which assumption is most dangerous?",
    options: [
      { key: "A", label: "No visible damage means no damage occurred" },
      { key: "B", label: "Administrator accounts exist" },
      { key: "C", label: "Logs can be collected" },
      { key: "D", label: "Users can change passwords" },
    ],
    correctOption: "A",
  },
  {
    id: 21,
    text: "Which statement is most accurate?",
    options: [
      { key: "A", label: "Every alert represents an attack" },
      { key: "B", label: "Every attack generates alerts" },
      { key: "C", label: "Some attacks may avoid detection mechanisms" },
      { key: "D", label: "Attacks always disrupt services" },
    ],
    correctOption: "C",
  },
  {
    id: 22,
    text: "Two vulnerable systems exist: System A (Public website) and System B (Internal HR database). Which should be prioritized?",
    options: [
      { key: "A", label: "System A only" },
      { key: "B", label: "System B only" },
      { key: "C", label: "Priority depends on exposure and business impact" },
      { key: "D", label: "Neither" },
    ],
    correctOption: "C",
  },
  {
    id: 23,
    text: "A login succeeds using valid credentials. What can be concluded?",
    options: [
      { key: "A", label: "The user is legitimate" },
      { key: "B", label: "Authentication succeeded, identity remains to be verified" },
      { key: "C", label: "The account is secure" },
      { key: "D", label: "No further review is needed" },
    ],
    correctOption: "B",
  },
  {
    id: 24,
    text: "Why can cyber incident attribution be difficult?",
    options: [
      { key: "A", label: "Attackers can disguise their origin and infrastructure" },
      { key: "B", label: "IP addresses do not exist" },
      { key: "C", label: "Firewalls block attribution permanently" },
      { key: "D", label: "Logs never contain evidence" },
    ],
    correctOption: "A",
  },
  {
    id: 25,
    text: "During a Linux audit, you discover a user can execute commands as root through a poorly configured script. What security issue does this represent?",
    options: [
      { key: "A", label: "Weak password" },
      { key: "B", label: "Privilege escalation opportunity" },
      { key: "C", label: "Antivirus failure" },
      { key: "D", label: "Network outage" },
    ],
    correctOption: "B",
  },
  {
    id: 26,
    text: "A Windows workstation contains a registry entry that launches a suspicious executable at every startup. What is the most likely concern?",
    options: [
      { key: "A", label: "Power management setting" },
      { key: "B", label: "Malware persistence mechanism" },
      { key: "C", label: "Display driver update" },
      { key: "D", label: "User preference" },
    ],
    correctOption: "B",
  },
  {
    id: 27,
    text: "A web application allows users to upload profile pictures. The server fails to validate file types and stores uploads in a web-accessible directory. What attack path is most concerning?",
    options: [
      { key: "A", label: "Uploading a malicious script and executing it" },
      { key: "B", label: "Changing wallpaper" },
      { key: "C", label: "Printing documents" },
      { key: "D", label: "Browser synchronization" },
    ],
    correctOption: "A",
  },
  {
    id: 28,
    text: "An online ticketing platform limits users to purchasing 2 tickets. A tester sends multiple requests simultaneously and purchases 10 tickets. Which vulnerability is most likely involved?",
    options: [
      { key: "A", label: "SQL Injection" },
      { key: "B", label: "Race Condition" },
      { key: "C", label: "XSS" },
      { key: "D", label: "Directory Traversal" },
    ],
    correctOption: "B",
  },
  {
    id: 29,
    text: "During an investigation, you discover a remote access tool running on a workstation. The employee denies installing it. What question is most useful?",
    options: [
      { key: "A", label: "Do you like computers?" },
      { key: "B", label: "Who owns the workstation?" },
      { key: "C", label: "What process installed or launched the tool?" },
      { key: "D", label: "How long have you worked here?" },
    ],
    correctOption: "C",
  },
  {
    id: 30,
    text: "You are reviewing logs from an organization. Evidence shows suspicious email delivery, VPN login from an unfamiliar device, password change, internal system access, and large outbound data transfer. Which conclusion is most justified?",
    options: [
      { key: "A", label: "The email definitely caused the incident" },
      { key: "B", label: "There is no evidence of compromise" },
      { key: "C", label: "Evidence strongly suggests account compromise and potential data exfiltration; containment should begin while root cause remains under investigation" },
      { key: "D", label: "The VPN system is broken" },
    ],
    correctOption: "C",
  },
];