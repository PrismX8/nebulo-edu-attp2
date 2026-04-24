import bcrypt from 'bcryptjs';
bcrypt.hash('$Egg@3heese', 10).then(h => {
  console.log(h);
  process.exit(0);
});