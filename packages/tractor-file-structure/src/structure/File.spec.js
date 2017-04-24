/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import fs from 'fs';
import path from 'path';
import { Directory } from './Directory';
import { FileStructure } from './FileStructure';
import { TractorError } from 'tractor-error-handler';

// Under test:
import { File } from './File';

describe('tractor-file-structure - File:', () => {
    describe('File constructor:', () => {
        it('should create a new File', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let file = new File(path.join(path.sep, 'file-structure', 'file.extension'), fileStructure);

            expect(file).to.be.an.instanceof(File);
        });

        it('should work out the name', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            expect(file.name).to.equal('file.ext');
        });

        it('should get the extension from the file', () => {
            class TestFile extends File { }
            TestFile.prototype.extension = '.test.ext';

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new TestFile(path.join(path.sep, 'file-structure', 'directory', 'file.test.ext'), fileStructure);

            expect(file.extension).to.equal('.test.ext');
        });

        it('should fall back to getting the extension from the path', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            expect(file.extension).to.equal('.ext');
        });

        it('should work out the basename from the path and the extension', () => {
            class TestFile extends File { }
            TestFile.prototype.extension = '.test.ext';

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new TestFile(path.join(path.sep, 'file-structure', 'directory', 'file.test.ext'), fileStructure);

            expect(file.basename).to.equal('file');
        });

        it('should work out the URL to the file from the fileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            expect(file.url).to.equal('/directory/file.ext');
        });

        it('should correctly replace Windows path seperators in the URL', () => {
            let origPath = {};
            Object.keys(path.win32).forEach(key => {
                origPath = path[key];
                path[key] = path.win32[key];
            });

            sinon.stub(process, 'cwd').returns('');

            let fileStructure = new FileStructure(path.win32.join(path.win32.sep, 'file-structure'));

            let file = new File(path.win32.join(path.win32.sep, 'file-structure', 'directory', 'another-directory', 'file.ext'), fileStructure);

            expect(file.url).to.equal('/directory/another-directory/file.ext');

            process.cwd.restore();

            Object.keys(path.win32).forEach(key => {
                path[key] = origPath[key];
            });
        });

        it('should work out the parent directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            expect(file.directory).to.equal(directory);
        });

        it(`should create the parent directory if it doesn't exist`, () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let file = new File(path.join(path.sep, 'file-structure', 'parent-directory', 'directory', 'file.ext'), fileStructure);

            expect(file.directory).to.not.be.undefined();
            expect(fileStructure.allDirectoriesByPath[path.join(path.sep, 'file-structure', 'parent-directory')]).to.not.be.undefined();
            expect(fileStructure.allDirectoriesByPath[path.join(path.sep, 'file-structure', 'parent-directory', 'directory')]).to.not.be.undefined();
        });

        it('should throw an error if the File path is outside the root of the FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            expect(() => {
                new File(path.join(path.sep, 'outside', 'file.ext'), fileStructure);
            }).to.throw(TractorError, `Cannot create "${path.join(path.sep, 'outside', 'file.ext')}" because it is outside of the root of the FileStructure`);
        });

        it('should throw an error if the File path is outside the root of the FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            expect(() => {
                new File(path.join(path.sep, 'outside', 'file.ext'), fileStructure);
            }).to.throw(TractorError, `Cannot create "${path.join(path.sep, 'outside', 'file.ext')}" because it is outside of the root of the FileStructure`);
        });

        it('should be added to its directory', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(directory, 'addItem');

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            expect(directory.addItem).to.have.been.calledWith(file);
        });
    });

    describe('File.cleanup:', () => {
      it('should delete the directory', () => {
          let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
          let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

          sinon.stub(directory, 'delete').returns(Promise.resolve());
          sinon.stub(directory.directory, 'cleanup').returns(Promise.resolve());

          return directory.cleanup()
          .then(() => {
              expect(directory.delete).to.have.been.called();
          });
      });

      it('should cleanup the parent directory', () => {
          let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
          let file = new File(path.join(path.sep, 'file-structure', 'file.ext'), fileStructure);

          sinon.stub(file, 'delete').returns(Promise.resolve());
          sinon.stub(file.directory, 'cleanup').returns(Promise.resolve());

          return file.cleanup()
          .then(() => {
              expect(file.directory.cleanup).to.have.been.called();
          });
      });

      it('should stop once it gets to a directory that is not empty', () => {
          let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
          let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
          let file1 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-1.ext'), fileStructure);
          let file2 = new File(path.join(path.sep, 'file-structure', 'directory', 'file-2.ext'), fileStructure);

          sinon.stub(fs, 'unlinkAsync').returns(Promise.resolve());
          sinon.spy(directory, 'delete');
          sinon.spy(file1, 'delete');
          sinon.spy(file2, 'delete');

          return file1.cleanup()
          .then(() => {
              expect(file1.delete).to.have.been.called();
              expect(fs.unlinkAsync).to.have.been.calledOnce();
              expect(directory.delete).to.have.been.called();
              expect(file2.delete).to.not.have.been.called();
          })
          .finally(() => {
              fs.unlinkAsync.restore();
          });
      });

      it('should rethrow if something unexpected goes wrong', () => {
          let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
          let file = new File(path.join(path.sep, 'file-structure', 'file.ext'), fileStructure);

          sinon.stub(fs, 'unlinkAsync').returns(Promise.reject(new Error('Unexpected error')));

          return file.cleanup()
          .catch(e => {
              expect(e).to.deep.equal(new Error('Unexpected error'));
          })
          .finally(() => {
              fs.unlinkAsync.restore();
          });
      });
    });

    describe('File.delete:', () => {
        it('should delete the file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'unlinkAsync').returns(Promise.resolve());

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            return file.delete()
            .then(() => {
                expect(fs.unlinkAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory', 'file.ext'));
            })
            .finally(() => {
                fs.unlinkAsync.restore();
            });
        });

        it(`should remove the file from it's directory`, () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

            sinon.stub(directory, 'removeItem');
            sinon.stub(fs, 'unlinkAsync').returns(Promise.resolve());

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            return file.delete()
            .then(() => {
                expect(directory.removeItem).to.have.been.calledOnce();
            })
            .finally(() => {
                fs.unlinkAsync.restore();
            });
        });
    });

    describe('File.move:', () => {
        it('should move a file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.spy(File.prototype, 'constructor');
            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            return file.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'file.ext')
            })
            .then(() => {
                expect(File.prototype.constructor).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'other-directory', 'file.ext'), fileStructure);
                expect(File.prototype.save).to.have.been.called();
                expect(File.prototype.delete).to.have.been.called();
            })
            .finally(() => {
                File.prototype.constructor.restore();
                File.prototype.delete.restore();
                File.prototype.save.restore();
            });
        });

        it('should pass the options through to the `save` and `delete` calls', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.spy(File.prototype, 'constructor');
            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
            let buffer = new Buffer('data');
            file.buffer = buffer;

            return file.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'file.ext')
            })
            .then(() => {
                expect(File.prototype.constructor).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'other-directory', 'file.ext'), fileStructure);
                expect(File.prototype.save).to.have.been.calledWith(buffer, { isMove: true });
                expect(File.prototype.delete).to.have.been.calledWith({ isMove: true });
            })
            .finally(() => {
                File.prototype.constructor.restore();
                File.prototype.delete.restore();
                File.prototype.save.restore();
            });
        });

        it('should copy a file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.spy(File.prototype, 'constructor');
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            return file.move({
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'file.ext')
            }, {
                isCopy: true
            })
            .then(() => {
                expect(File.prototype.constructor).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'other-directory', 'file.ext'), fileStructure);
                expect(File.prototype.save).to.have.been.called();
                expect(File.prototype.delete).to.not.have.been.called();
            })
            .finally(() => {
                File.prototype.constructor.restore();
                File.prototype.delete.restore();
                File.prototype.save.restore();
            });
        });
    });

    describe('File.read:', () => {
        it('should read the file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'readFileAsync').returns(Promise.resolve(new Buffer('content')));

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            return file.read()
            .then(() => {
                expect(fs.readFileAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory', 'file.ext'));
                expect(file.content).to.equal('content');
                expect(file.buffer.equals(new Buffer('content'))).to.equal(true);
            })
            .finally(() => {
                fs.readFileAsync.restore();
            });
        });
    });

    describe('File.refactor:', () => {
        it('should do nothing by default', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.spy(Promise, 'resolve');

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            return file.refactor()
            .then(() => {
                expect(Promise.resolve).to.have.been.called();
            })
            .finally(() => {
                Promise.resolve.restore();
            });
        });
    });

    describe('File.save:', () => {
        it('should save the file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
            sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            return file.save('content')
            .then(() => {
                expect(fs.writeFileAsync).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), 'content');
                expect(file.content).to.equal('content');
                expect(file.buffer.equals(new Buffer('content'))).to.equal(true);
            })
            .finally(() => {
                fs.mkdirAsync.restore();
                fs.writeFileAsync.restore();
            });
        });

        it('should make sure the parent directory is saved', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(Directory.prototype, 'save').returns(Promise.resolve());
            sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());

            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            return file.save('content')
            .then(() => {
                expect(Directory.prototype.save).to.have.been.called();
            })
            .finally(() => {
                Directory.prototype.save.restore();
                fs.writeFileAsync.restore();
            });
        })
    });

    describe('File.serialise:', () => {
        it('should call `File.prototype.toJSON`', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            let serialised = file.serialise();

            expect(serialised).to.deep.equal({
                basename: 'file',
                extension: '.ext',
                path: path.join(path.sep, 'file-structure', 'directory', 'file.ext'),
                url: '/directory/file.ext'
            });
        });
    });

    describe('File.toJSON:', () => {
        it('should return specific properties of the object', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

            let json = file.toJSON();

            expect(json).to.deep.equal({
                basename: 'file',
                extension: '.ext',
                path: path.join(path.sep, 'file-structure', 'directory', 'file.ext'),
                url: '/directory/file.ext'
            });
        });
    });
});
