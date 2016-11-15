after "deploy:setup", "deploy:create_release_dir"
namespace :deploy do
  task :create_release_dir, :except => {:no_release => true} do
    run "mkdir -p #{fetch :releases_path}"
  end
end
