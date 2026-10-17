from pathlib import Path



BOOTSTRAP_PATH = Path("agent/bootstrap")



class Bootstrap():
    """This class manages the bootstrap files for the agent"""

    def __init__(self, files = None):
        self.path = BOOTSTRAP_PATH / "instructions"
        self.files = files
        self.data = {}



    def load(self):
        if self.files is None:
            md_files = sorted(self.path.glob("*.md"))
        else:
            md_files = [self.path / name for name in self.files]

        for file in md_files:
            with open(file, "r") as f:
                self.data[file.name] = f.read()

        return self.data

    def get_data(self) -> dict | None:
        return self.data


boot = Bootstrap()

boot.load()


print(boot.data)





















