load "config/deploy/recipes/setup"

# Application name
set :application, "16299"

role :app, '104.130.4.201','104.130.1.100'

# Repository
set :scm, :git
set :branch, "master"
set :repository,  "git@bitbucket.org:enigmamarketingdigital/symantec-emea-16299-cws-video.git"
set :deploy_via, :remote_cache #speed up deployments by keeping local git repo on server and use fetch
set :deploy_subdir, "htdocs"

# User to deploy as
# set :user, "deploy"
set :group, "www-data"
set :default_environment, { 'PATH' => "/srv/websites/symantec-usa-campaigns/#{application}/current/bin:$PATH" }

# Deploy location
set(:deploy_to) { "/srv/websites/symantec-usa-campaigns/#{application}" }

# Tell cap not to user sudo in its internal commands
set :use_sudo, false

# Required for sudo password prompts
default_run_options[:pty] = true

# Forward public keys for authentication.
ssh_options[:forward_agent] = true

# Don't get capistrano to normalise asset timestamps, it expects a /public folder as per rails defaults
# Asset serving will also be left to s3 which will take care of last-modified header timestamps.
set :normalize_asset_timestamps, false

# Each deploy is kept in the releases folder, this hook removes releases older than 5
set :keep_releases, 5
after "deploy:restart", "deploy:cleanup"
