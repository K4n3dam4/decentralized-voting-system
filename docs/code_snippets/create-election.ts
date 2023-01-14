async createElection(dto: ElectionCreateDto, id: number) {
  // get admin
  const admin = await this.prisma.user.findUnique({ where: { id } });
  if (!admin) throw new ForbiddenException('error.api.election.wrongServiceNumber');
  // create admin signer and contract factory
  const signer = this.signer.createWallet(this.config.get('adminPk'));
  const factory = new ContractFactory(Election__factory.abi, Election__factory.bytecode, signer);

  try {
    // deploy contract
    const contract = await factory.deploy(
      dto.name,
      dto.candidates.map(({ name }) => name),
      dto.expires,
    );
    // add election to db
    const election = await this.prisma.election.create({
      data: {
        name: dto.name,
        image: dto.image,
        description: dto.description,
        candidates: dto.candidates as unknown as Prisma.JsonArray,
        contract: contract.address,
        expires: new Date(dto.expires * 1000),
        eligibleVoters: {
          create: dto.eligibleVoters.map((ssn) => ({ ssn })),
        },
        admin: {
          connect: {
            id: admin.id,
          },
        },
      },
    });

    return { ...election };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new HttpException({ message: 'error.api.server.error' }, 500);
    } else {
      if (error?.error?.error?.data?.reason) {
        throw new HttpException({ message: error.error.error.data.reason }, 403);
      } else if (error?.error?.reason) {
        const code = error.error.reason.split(': ')[1];
        throw new HttpException({ message: code }, 403);
      } else {
        throw new HttpException({ message: 'error.contract.unknown' }, 500);
      }
    }
  }
}