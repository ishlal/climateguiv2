from cx_Freeze import setup, Executable

setup(name = 'promethee-gui',
      version = '0.1',
      description = 'Climate GUI',
      executables = [Executable("promethee-gui8.py")])