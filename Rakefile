public_dir = "lib/pifi/public/"
frontend_dir = "frontend/"
frontend_build = "frontend/build/"

desc "Build frontend"
task :build do
  sh "cd #{frontend_dir} && npm run build"
  sh "rsync -a --delete #{frontend_build}/ #{public_dir}/"
end

desc "Build gem"
task :build_gem => [:build] do
  sh "gem build pifi.gemspec"
end

desc "Clean build files"
task :clean do
  sh "rm pifi-*.gem"
  sh "rm -rf lib/pifi/public/*"
end

desc "Run PiFi"
task :serve => [:build] do
  sh "rackup -Ilib --host 0.0.0.0"
end

desc "Run server with React reload"
task :start do
  sh "rackup -Ilib --host 0.0.0.0 --quiet &"
  sh "cd #{frontend_dir} && npm run start"
end

